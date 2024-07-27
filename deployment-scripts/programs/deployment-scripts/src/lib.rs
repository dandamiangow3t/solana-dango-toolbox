use anchor_lang::prelude::*;

declare_id!("Hi2qg8TLrcZTfSYAT9rPxHLzgVCsE8GsQ2rJ2hJcLBsW");

#[program]
pub mod deployment_scripts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
