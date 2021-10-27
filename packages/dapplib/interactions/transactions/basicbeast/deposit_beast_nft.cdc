import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction(recipientAddr: Address, beastID: UInt64) {
    
    prepare(acct: AuthAccount) {
        let recipient = getAccount(recipientAddr)

        let receiverRef = recipient.getCapability(BasicBeast.CollectionPublicPath)
            .borrow<&{BasicBeast.BeastCollectionPublic}>()
                ?? panic("Couldn't borrow reference to Receiver's collection")
    

        if let collection = acct.borrow<&BasicBeast.Collection>(from: BasicBeast.CollectionStoragePath) {
            receiverRef.deposit(token: <-collection.withdraw(withdrawID: beastID))
        }

    }
}