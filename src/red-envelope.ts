import { Address, BigInt } from "@graphprotocol/graph-ts";

import {
  EnvelopeClaimed,
  EnvelopeCreated,
  EnvelopeReclaimed,
} from "../generated/RedEnvelope/RedEnvelope";
import { Claim, Envelope, Reclaim } from "../generated/schema";

export function handleEnvelopeCreated(event: EnvelopeCreated): void {
  const id = event.params.envelopeId.toString();
  const envelope = new Envelope(id);

  envelope.creator = event.params.creator;
  envelope.totalAmount = event.params.amount;
  envelope.remainingAmount = event.params.amount;
  envelope.totalSlots = event.params.totalSlots;
  envelope.remainingSlots = event.params.totalSlots;
  envelope.equalShare = event.params.equalShare;
  envelope.createdAt = event.params.createdAt;
  envelope.reclaimed = false;
  envelope.claimedCount = 0;
  envelope.createdTxHash = event.transaction.hash;
  envelope.createdBlockNumber = event.block.number;
  envelope.createdBlockTimestamp = event.block.timestamp;

  envelope.save();
}

export function handleEnvelopeClaimed(event: EnvelopeClaimed): void {
  const id = event.params.envelopeId.toString();
  let envelope = Envelope.load(id);

  if (envelope == null) {
    envelope = new Envelope(id);
    envelope.creator = Address.zero();
    envelope.totalAmount = event.params.amount.plus(
      event.params.remainingAmount,
    );
    envelope.remainingAmount = event.params.remainingAmount;
    envelope.totalSlots = event.params.remainingSlots + 1;
    envelope.remainingSlots = event.params.remainingSlots;
    envelope.equalShare = false;
    envelope.createdAt = event.block.timestamp;
    envelope.reclaimed = false;
    envelope.claimedCount = 0;
    envelope.createdTxHash = event.transaction.hash;
    envelope.createdBlockNumber = event.block.number;
    envelope.createdBlockTimestamp = event.block.timestamp;
  }

  envelope.remainingAmount = event.params.remainingAmount;
  envelope.remainingSlots = event.params.remainingSlots;
  envelope.claimedCount = envelope.claimedCount + 1;
  envelope.save();

  const claimId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  const claim = new Claim(claimId);

  claim.envelope = envelope.id;
  claim.claimer = event.params.claimer;
  claim.amount = event.params.amount;
  claim.remainingSlots = event.params.remainingSlots;
  claim.remainingAmount = event.params.remainingAmount;
  claim.blockNumber = event.block.number;
  claim.blockTimestamp = event.block.timestamp;
  claim.transactionHash = event.transaction.hash;

  claim.save();
}

export function handleEnvelopeReclaimed(event: EnvelopeReclaimed): void {
  const id = event.params.envelopeId.toString();
  let envelope = Envelope.load(id);

  if (envelope == null) {
    envelope = new Envelope(id);
    envelope.creator = event.params.creator;
    envelope.totalAmount = event.params.amount;
    envelope.remainingAmount = BigInt.zero();
    envelope.totalSlots = 0;
    envelope.remainingSlots = 0;
    envelope.equalShare = false;
    envelope.createdAt = event.block.timestamp;
    envelope.reclaimed = true;
    envelope.claimedCount = 0;
    envelope.createdTxHash = event.transaction.hash;
    envelope.createdBlockNumber = event.block.number;
    envelope.createdBlockTimestamp = event.block.timestamp;
  } else {
    envelope.remainingAmount = BigInt.zero();
    envelope.remainingSlots = 0;
    envelope.reclaimed = true;
  }

  envelope.save();

  const reclaimId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  const reclaim = new Reclaim(reclaimId);

  reclaim.envelope = envelope.id;
  reclaim.creator = event.params.creator;
  reclaim.amount = event.params.amount;
  reclaim.blockNumber = event.block.number;
  reclaim.blockTimestamp = event.block.timestamp;
  reclaim.transactionHash = event.transaction.hash;

  reclaim.save();
}
