use anchor_lang::prelude::*;

use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct DoSomethingPartTwo<'info> {

    #[account(seeds = [SEED, SEED_CONFIG, signer.key().as_ref()], bump)]
    pub config: Account<'info, SomeConfig>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl DoSomethingPartTwo<'_> {
    pub fn handler(ctx: Context<DoSomethingPartTwo>) -> Result<()> {
        let config = & ctx.accounts.config;
        msg!("some_config.amount {}", config.amount);

        Ok(())
    }
}