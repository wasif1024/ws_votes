import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";
import type { WsVotes } from "../target/types/ws_votes";
import { BN } from "@coral-xyz/anchor";
import idl from "../target/idl/ws_votes.json";

//const idl=require("../target/deploy/ws_vote.json");
//const voting_address=new PublicKey("13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg");
describe("ws_votes", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const { connection } = provider;
  const wallet = provider.wallet;
  
  const providerInstance = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(providerInstance);
  //const program = anchor.workspace.wsVotes as Program<WsVotes>;
  const program = new Program(idl as WsVotes, providerInstance);

  it("Poll Initialization", async () => {
    // Add your test here.
    console.log("Program Id now",program.programId.toBase58());
    const pollId = new BN(1);
    const pollStart = new BN(2);
    const pollEnd = new BN(3);
    const description = "hhg";
    
    /*const tx = await program.methods
      .initializeVoting(pollId, pollStart, pollEnd, description)
      .rpc();
    console.log("Your transaction signature", tx);*/
  });
});
