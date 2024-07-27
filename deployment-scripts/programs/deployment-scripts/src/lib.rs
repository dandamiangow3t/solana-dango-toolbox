use anchor_lang::prelude::*;

declare_id!("GMwTBSDebYGD4qGq2NKcuBhGpzaxr6AHn1u57k45mCWQ");

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
