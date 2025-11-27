import { DataStored as DataStoredEvent } from "../generated/MyLogger/MyLogger"
import { DataStored } from "../generated/schema"

export function handleDataStored(event: DataStoredEvent): void {
  let entity = new DataStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.message = event.params.message
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
