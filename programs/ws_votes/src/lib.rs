use anchor_lang::prelude::*;

declare_id!("13cPJfvm6R4Z965utk47dDgemVdGVN2wSbgE9zZ1zHzg");

#[program]
pub mod ws_votes {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
