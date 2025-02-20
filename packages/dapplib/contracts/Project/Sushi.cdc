import FungibleToken from "../Flow/FungibleToken.cdc"

// Token contract of Sushi (SUSHI)
pub contract Sushi: FungibleToken {

    // -----------------------------------------------------------------------
    // Sushi contract Events
    // -----------------------------------------------------------------------

    // Event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    // Event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    // Event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    // Event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    // Event that is emitted when tokens are destroyed
    pub event TokensBurned(amount: UFix64)

    // Event that is emitted when a new minter resource is created
    pub event MinterCreated()

    // Event that is emitted when a new burner resource is created
    pub event BurnerCreated()

    // Event that is emitted when a new MinterProxy resource is created
    pub event MinterProxyCreated()

    // -----------------------------------------------------------------------
    // Sushi contract Named Paths
    // -----------------------------------------------------------------------

    // Defines Sushi vault storage path
    pub let VaultStoragePath: StoragePath

    // Defines Sushi vault public balance path
    pub let BalancePublicPath: PublicPath

    // Defines Sushi vault public receiver path
    pub let ReceiverPublicPath: PublicPath

    // Defines Sushi admin storage path
    pub let AdminStoragePath: StoragePath

    // Defines Sushi minter storage path
    pub let MinterStoragePath: StoragePath

    // Defines Sushi minters' MinterProxy storage path
    pub let MinterProxyStoragePath: StoragePath

    // Defines Sushi minters' MinterProxy capability public path
    pub let MinterProxyPublicPath: PublicPath

    // -----------------------------------------------------------------------
    // Sushi contract fields
    // These contain actual values that are stored in the smart contract
    // -----------------------------------------------------------------------

    // Total supply of Sushi in existence
    pub var totalSupply: UFix64

    // Vault
    //
    // Each user stores an instance of only the Vault in their storage
    // The functions in the Vault are governed by the pre and post conditions
    // in FungibleToken when they are called.
    // The checks happen at runtime whenever a function is called.
    //
    // Resources can only be created in the context of the contract that they
    // are defined in, so there is no way for a malicious user to create Vaults
    // out of thin air. A special Minter resource needs to be defined to mint
    // new tokens.
    //
    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        // holds the balance of a users tokens
        pub var balance: UFix64

        // initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        // withdraw
        //
        // Function that takes an integer amount as an argument
        // and withdraws that amount from the Vault.
        // It creates a new temporary Vault that is used to hold
        // the money that is being transferred. It returns the newly
        // created Vault to the context that called so it can be deposited
        // elsewhere.
        //
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        // deposit
        //
        // Function that takes a Vault object as an argument and adds
        // its balance to the balance of the owners Vault.
        // It is allowed to destroy the sent Vault because the Vault
        // was a temporary holder of the tokens. The Vault's balance has
        // been consumed and therefore can be destroyed.
        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @Sushi.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            Sushi.totalSupply = Sushi.totalSupply - self.balance
        }
    }

    // createEmptyVault
    //
    // Function that creates a new Vault with a balance of zero
    // and returns it to the calling context. A user must call this function
    // and store the returned Vault in their storage in order to allow their
    // account to be able to receive deposits of this token type.
    //
    pub fun createEmptyVault(): @FungibleToken.Vault {
        return <-create Vault(balance: 0.0)
    }

    // Administrator
    //
    // Resource object that token admin accounts can hold to create new minters and burners.
    //
    pub resource Administrator {
        // createNewMinter
        //
        // Function that creates and returns a new minter resource
        //
        pub fun createNewMinter(): @Minter {
            emit MinterCreated()
            return <-create Minter()
        }

        // createNewBurner
        //
        // Function that creates and returns a new burner resource
        //
        pub fun createNewBurner(): @Burner {
            emit BurnerCreated()
            return <-create Burner()
        }
    }

    // Minter
    //
    // Resource object that token admin accounts can hold to mint new tokens.
    //
    pub resource Minter {

        // mintTokens
        //
        // Function that mints new tokens, adds them to the total supply,
        // and returns them to the calling context.
        //
        pub fun mintTokens(amount: UFix64): @Sushi.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
            }
            Sushi.totalSupply = Sushi.totalSupply + amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

    }

    // Burner
    //
    // Resource object that token admin accounts can hold to burn tokens.
    //
    pub resource Burner {

        // burnTokens
        //
        // Function that destroys a Vault instance, effectively burning the tokens.
        //
        // Note: the burned tokens are automatically subtracted from the 
        // total supply in the Vault destructor.
        //
        pub fun burnTokens(from: @FungibleToken.Vault) {
            let vault <- from as! @Sushi.Vault
            let amount = vault.balance
            destroy vault
            emit TokensBurned(amount: amount)
        }
    }
    
    pub resource interface MinterProxyPublic {
        pub fun setMinterCapability(cap: Capability<&Minter>)
    }

    // MinterProxy
    //
    // Resource object holding a capability that can be used to mint new tokens.
    // The resource that this capability represents can be deleted by the admin
    // in order to unilaterally revoke minting capability if needed.

    pub resource MinterProxy: MinterProxyPublic {

        // access(self) so nobody else can copy the capability and use it.
        access(self) var minterCapability: Capability<&Minter>?

        // Anyone can call this, but only the admin can create Minter capabilities,
        // so the type system constrains this to being called by the admin.
        pub fun setMinterCapability(cap: Capability<&Minter>) {
            self.minterCapability = cap
        }

        pub fun mintTokens(amount: UFix64): @Sushi.Vault {
            return <- self.minterCapability!
            .borrow()!
            .mintTokens(amount:amount)
        }

        init() {
            self.minterCapability = nil
        }

    }

    // createMinterProxy
    //
    // Function that creates a MinterProxy.
    // Anyone can call this, but the MinterProxy cannot mint without a Minter capability,
    // and only the admin can provide that.
    //
    pub fun createMinterProxy(): @MinterProxy {
        emit MinterProxyCreated()
        return <- create MinterProxy()
    }

    init() {
        self.VaultStoragePath = /storage/sushiVault
        self.ReceiverPublicPath = /public/sushiReceiver
        self.BalancePublicPath = /public/sushiBalance
        self.AdminStoragePath = /storage/sushiAdmin
        self.MinterStoragePath = /storage/sushiMinter
        self.MinterProxyPublicPath = /public/sushiMinterProxy
        self.MinterProxyStoragePath = /storage/sushiMinterProxy

        self.totalSupply = 0.0

        // Create the Vault with the total supply of tokens and save it in storage
        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: self.VaultStoragePath)

        // Create a public capability to the stored Vault that only exposes
        // the `deposit` method through the `Receiver` interface
        self.account.link<&Sushi.Vault{FungibleToken.Receiver}>(
            self.ReceiverPublicPath,
            target: self.VaultStoragePath
        )

        // Create a public capability to the stored Vault that only exposes
        // the `balance` field through the `Balance` interface
        self.account.link<&Sushi.Vault{FungibleToken.Balance}>(
            self.BalancePublicPath,
            target: self.VaultStoragePath
        )

        let admin <- create Administrator()
        self.account.save(<-admin, to: self.AdminStoragePath)

        // Emit an event that shows that the contract was initialized
        emit TokensInitialized(initialSupply: self.totalSupply)
    }

}