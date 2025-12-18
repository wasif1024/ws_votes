import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";
import type { WsVotes } from "../target/types/ws_votes";
import { BN } from "@coral-xyz/anchor";
import { expect } from "chai";
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
    console.log("Wallet Id now",wallet.publicKey.toBase58());
    console.log("Program Id now",program.programId.toBase58());
    const pollId = new anchor.BN(1);
    const pollStart = new anchor.BN(0);
    const pollEnd = new anchor.BN(1866067085);
    const description = "Favourite fruit";
    
const tx = await program.methods
      .initializeVoting(pollId, pollStart, pollEnd, description)
      .rpc();
      const [pollAddress] = PublicKey.findProgramAddressSync([pollId.toArrayLike(Buffer, "le", 8)], program.programId);
      console.log("Poll address", pollAddress.toBase58());
      const poll=await program.account.poll.fetchNullable(pollAddress);
      console.log("Poll values", poll);
      expect(poll.pollId.toNumber()).to.equal(1); 
      expect(poll.description).to.equal("Favourite fruit");
      //console.log("Your transaction signature", tx);
  });
  it("Candidate Initialization", async () => {
   const tx=await program.methods.initializeCandidate("Smooth",new anchor.BN(1)).rpc();
   const [candidateAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")], program.programId);
   const candidate=await program.account.candidate.fetchNullable(candidateAddress);
   console.log("Candidate values", candidate);
   expect(candidate.candidateName).to.equal("Smooth");
   expect(candidate.pollId.toNumber()).to.equal(1);
   expect(candidate.candidateVote.toNumber()).to.equal(0);

   const txCrunchy=await program.methods.initializeCandidate("Crunchy",new anchor.BN(1)).rpc();
   const [crunchyCandidateAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")], program.programId);
   const crunchyCandidate=await program.account.candidate.fetchNullable(crunchyCandidateAddress);
   console.log("Candidate values", candidate);
   expect(crunchyCandidate.candidateName).to.equal("Crunchy");
   expect(crunchyCandidate.pollId.toNumber()).to.equal(1);
   expect(crunchyCandidate.candidateVote.toNumber()).to.equal(0);
   //console.log("Your transaction signature", tx);
  });
  it("Candidate Vote", async () => {
   
    //console.log("Your transaction signature", tx);
});
});
