use anchor_lang::{accounts::interface_account, prelude::*};

declare_id!("13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg");

#[program]
pub mod ws_votes {
    use super::*;

    pub fn initialize_voting(ctx: Context<InitializePoll>,poll_id:u64,poll_start:u64,poll_end:u64,description:String) -> Result<()> {
        //msg!("Greetings from: {:?}", ctx.program_id);
        let poll=&mut ctx.accounts.poll;
        poll.poll_id=poll_id;
        poll.poll_start=poll_start;
        poll.poll_end=poll_end;
        poll.description=description;
        Ok(())
    }
    pub fn initialize_candidate(ctx:Context<InitializeCandidate>,candidate_name:String,poll_id:u64)->Result<()> {
        let candidate=&mut ctx.accounts.candidate;
        let poll=&mut ctx.accounts.poll;
        poll.candidate_amount+=1;
        
        candidate.candidate_name=candidate_name;
        candidate.poll_id=poll_id;
        candidate.candidate_vote=0;
        Ok(())
    }
    pub fn vote(ctx:Context<Vote>,candidate_name:String,poll_id:u64)->Result<()> {
        let candidate=&mut ctx.accounts.candidate;
        candidate.candidate_vote+=1;

        msg!("Candidate vote: {:?}", candidate.candidate_vote);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(init_if_needed,payer=signer,space=8+Poll::INIT_SPACE,seeds=[poll_id.to_le_bytes().as_ref()],bump)]
    pub poll:Account<'info,Poll>,
    pub system_program:Program<'info,System>
}
#[account]
#[derive(InitSpace)]
pub struct Poll{
pub poll_id:u64,
#[max_len(32)]
pub description:String,
pub poll_start:u64,
pub poll_end:u64,
pub candidate_amount:u64
}
#[derive(Accounts)]
#[instruction(candidate_name:String,poll_id:u64)]
pub struct InitializeCandidate<'info>{
#[account(mut)]
pub signer:Signer<'info>,
#[account(mut,seeds=[poll_id.to_le_bytes().as_ref()],bump)]
pub poll:Account<'info,Poll>,
#[account(init_if_needed,payer=signer,space=8+Candidate::INIT_SPACE,seeds=[poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes().as_ref()],bump)]
pub candidate:Account<'info,Candidate>,
pub system_program:Program<'info,System>
}
#[account]
#[derive(InitSpace)]
pub struct Candidate{
#[max_len(32)]
pub candidate_name:String,
pub poll_id:u64,
pub candidate_vote:u64
}

#[derive(Accounts)]
#[instruction(candidate_name:String,poll_id:u64)]
pub struct Vote<'info>{
#[account()]
pub signer:Signer<'info>,
#[account(seeds=[poll_id.to_le_bytes().as_ref()],bump)]
pub poll:Account<'info,Poll>,
#[account(mut,seeds=[poll_id.to_le_bytes().as_ref(),candidate_name.as_bytes().as_ref()],bump)]
pub candidate:Account<'info,Candidate>,
}