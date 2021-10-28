/*

Still need some work

import BasicBeast from "../../../../contracts/Project/BasicBeast.cdc"

pub fun main(account: Address): [&BasicBeast.NFT] {
    
    let acct = getAccount(account)

    let collectionRef = acct.getCapability(BasicBeast.CollectionPublicPath)
        .borrow<&{BasicBeast.BeastCollectionPublic}>()!

    let beastIDs = collectionRef.getIDs()

    var i = 0
    
    while i < beastIDs.length {
        for beastID in beastIDs {
            let token = collectionRef.borrowBeast(id: beastID)
                ?? panic("Couldn't borrow a reference to the specified beast")

            let beastTemmplate = token
        }
    }

    return []

}

*/