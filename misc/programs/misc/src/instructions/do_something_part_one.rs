use anchor_lang::prelude::*;

use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct DoSomethinPartOne<'info> {

    #[account(mut, seeds = [SEED, SEED_CONFIG, signer.key().as_ref()], bump)]
    pub config: Account<'info, SomeConfig>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl DoSomethinPartOne<'_> {
    
    pub fn handler(ctx: Context<DoSomethinPartOne>, amount: u16) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.amount = amount;

        Ok(())
    }
}