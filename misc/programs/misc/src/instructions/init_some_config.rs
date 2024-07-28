use anchor_lang::prelude::*;

use crate::state::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct InitSomeConfig<'info> {

    #[account(
        init, 
        payer = signer,
        space = SomeConfig::size(), 
        seeds = [SEED, SEED_CONFIG, signer.key().as_ref()], bump)
    ]
    pub config: Account<'info, SomeConfig>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl InitSomeConfig<'_> {
    pub fn handler(ctx: Context<InitSomeConfig>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.bump = ctx.bumps.config;
    
        Ok(())
    }
}