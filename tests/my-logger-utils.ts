import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { DataStored } from "../generated/MyLogger/MyLogger"

export function createDataStoredEvent(
  sender: Address,
  message: string,
  timestamp: BigInt
): DataStored {
  let dataStoredEvent = changetype<DataStored>(newMockEvent())

  dataStoredEvent.parameters = new Array()

  dataStoredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return dataStoredEvent
}
