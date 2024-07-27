use anchor_lang::prelude::*;

declare_id!("GdxXitPMTzfiWJFqr8FwcT6aYdHpMEdMU7fEZecUL64D");

#[program]
pub mod limits {
    use super::*;

    pub fn test_ix_accounts_limit_success(ctx: Context<TestIxAccountsLimitSuccess>) -> Result<()> {
        msg!("test_ix_accounts_limit_success/ first account {}", ctx.accounts.account_0.key());
        Ok(())
    }

    pub fn test_ix_accounts_limit_fail(ctx: Context<TestIxAccountsLimitFail>) -> Result<()> {
        msg!("test_ix_accounts_limit_fail/ first account {}", ctx.accounts.account_0.key());
        Ok(())
    }

    pub fn test_ix_accounts_and_signature_limit_success(ctx: Context<TestIxAccountsAndSignaturesLimitSuccess>) -> Result<()> {
        msg!("test_ix_accounts_and_signature_limit_success/ first account {}", ctx.accounts.account_0.key());
        Ok(())
    }

    pub fn test_ix_accounts_and_signature_limit_fail(ctx: Context<TestIxAccountsAndSignaturesLimitFail>) -> Result<()> {
        msg!("test_ix_accounts_and_signature_limit_fail/ first account {}", ctx.accounts.account_0.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TestIxAccountsLimitSuccess<'info> {
    
    /// CHECK
    pub account_0: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_1: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_2: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_3: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_4: UncheckedAccount<'info>,

    /// CHECK
    pub account_5: UncheckedAccount<'info>,

    /// CHECK
    pub account_6: UncheckedAccount<'info>,

    /// CHECK
    pub account_7: UncheckedAccount<'info>,

    /// CHECK
    pub account_8: UncheckedAccount<'info>,

    /// CHECK
    pub account_9: UncheckedAccount<'info>,

    /// CHECK
    pub account_10: UncheckedAccount<'info>,

    /// CHECK
    pub account_11: UncheckedAccount<'info>,

    /// CHECK
    pub account_12: UncheckedAccount<'info>,

    /// CHECK
    pub account_13: UncheckedAccount<'info>,

    /// CHECK
    pub account_14: UncheckedAccount<'info>,

    /// CHECK
    pub account_15: UncheckedAccount<'info>,

    /// CHECK
    pub account_16: UncheckedAccount<'info>,

    /// CHECK
    pub account_17: UncheckedAccount<'info>,

    /// CHECK
    pub account_18: UncheckedAccount<'info>,

    /// CHECK
    pub account_19: UncheckedAccount<'info>,

    /// CHECK
    pub account_20: UncheckedAccount<'info>,

    /// CHECK
    pub account_21: UncheckedAccount<'info>,

    /// CHECK
    pub account_22: UncheckedAccount<'info>,

    /// CHECK
    pub account_23: UncheckedAccount<'info>,

    /// CHECK
    pub account_24: UncheckedAccount<'info>,

    /// CHECK
    pub account_25: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_26: UncheckedAccount<'info>,

    /// CHECK
    pub account_27: UncheckedAccount<'info>,

    /// CHECK
    pub account_28: UncheckedAccount<'info>,

    /// CHECK
    pub account_29: UncheckedAccount<'info>,

    /// CHECK
    pub account_30: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct TestIxAccountsLimitFail<'info> {
    
    /// CHECK
    pub account_0: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_1: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_2: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_3: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_4: UncheckedAccount<'info>,

    /// CHECK
    pub account_5: UncheckedAccount<'info>,

    /// CHECK
    pub account_6: UncheckedAccount<'info>,

    /// CHECK
    pub account_7: UncheckedAccount<'info>,

    /// CHECK
    pub account_8: UncheckedAccount<'info>,

    /// CHECK
    pub account_9: UncheckedAccount<'info>,

    /// CHECK
    pub account_10: UncheckedAccount<'info>,

    /// CHECK
    pub account_11: UncheckedAccount<'info>,

    /// CHECK
    pub account_12: UncheckedAccount<'info>,

    /// CHECK
    pub account_13: UncheckedAccount<'info>,

    /// CHECK
    pub account_14: UncheckedAccount<'info>,

    /// CHECK
    pub account_15: UncheckedAccount<'info>,

    /// CHECK
    pub account_16: UncheckedAccount<'info>,

    /// CHECK
    pub account_17: UncheckedAccount<'info>,

    /// CHECK
    pub account_18: UncheckedAccount<'info>,

    /// CHECK
    pub account_19: UncheckedAccount<'info>,

    /// CHECK
    pub account_20: UncheckedAccount<'info>,

    /// CHECK
    pub account_21: UncheckedAccount<'info>,

    /// CHECK
    pub account_22: UncheckedAccount<'info>,

    /// CHECK
    pub account_23: UncheckedAccount<'info>,

    /// CHECK
    pub account_24: UncheckedAccount<'info>,

    /// CHECK
    pub account_25: UncheckedAccount<'info>,
    
    /// CHECK
    pub account_26: UncheckedAccount<'info>,

    /// CHECK
    pub account_27: UncheckedAccount<'info>,

    /// CHECK
    pub account_28: UncheckedAccount<'info>,

    /// CHECK
    pub account_29: UncheckedAccount<'info>,

    /// CHECK
    pub account_30: UncheckedAccount<'info>,

    /// CHECK
    pub account_31: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct TestIxAccountsAndSignaturesLimitSuccess<'info> {
    
    pub signer_0: Signer<'info>,
    
    pub signer_1: Signer<'info>,
    
    pub signer_2: Signer<'info>,
    

    /// CHECK
    pub account_0: UncheckedAccount<'info>,

    /// CHECK
    pub account_1: UncheckedAccount<'info>,

    /// CHECK
    pub account_2: UncheckedAccount<'info>,

    /// CHECK
    pub account_3: UncheckedAccount<'info>,

    /// CHECK
    pub account_4: UncheckedAccount<'info>,

    /// CHECK
    pub account_5: UncheckedAccount<'info>,

    /// CHECK
    pub account_6: UncheckedAccount<'info>,

    /// CHECK
    pub account_7: UncheckedAccount<'info>,

    /// CHECK
    pub account_8: UncheckedAccount<'info>,

    /// CHECK
    pub account_9: UncheckedAccount<'info>,

    /// CHECK
    pub account_10: UncheckedAccount<'info>,

    /// CHECK
    pub account_11: UncheckedAccount<'info>,

    /// CHECK
    pub account_12: UncheckedAccount<'info>,

    /// CHECK
    pub account_13: UncheckedAccount<'info>,

    /// CHECK
    pub account_14: UncheckedAccount<'info>,

    /// CHECK
    pub account_15: UncheckedAccount<'info>,

    /// CHECK
    pub account_16: UncheckedAccount<'info>,

    /// CHECK
    pub account_17: UncheckedAccount<'info>,

    /// CHECK
    pub account_18: UncheckedAccount<'info>,

    /// CHECK
    pub account_19: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct TestIxAccountsAndSignaturesLimitFail<'info> {
    
    pub signer_0: Signer<'info>,
    
    pub signer_1: Signer<'info>,
    
    pub signer_2: Signer<'info>,
    

    /// CHECK
    pub account_0: UncheckedAccount<'info>,

    /// CHECK
    pub account_1: UncheckedAccount<'info>,

    /// CHECK
    pub account_2: UncheckedAccount<'info>,

    /// CHECK
    pub account_3: UncheckedAccount<'info>,

    /// CHECK
    pub account_4: UncheckedAccount<'info>,

    /// CHECK
    pub account_5: UncheckedAccount<'info>,

    /// CHECK
    pub account_6: UncheckedAccount<'info>,

    /// CHECK
    pub account_7: UncheckedAccount<'info>,

    /// CHECK
    pub account_8: UncheckedAccount<'info>,

    /// CHECK
    pub account_9: UncheckedAccount<'info>,

    /// CHECK
    pub account_10: UncheckedAccount<'info>,

    /// CHECK
    pub account_11: UncheckedAccount<'info>,

    /// CHECK
    pub account_12: UncheckedAccount<'info>,

    /// CHECK
    pub account_13: UncheckedAccount<'info>,

    /// CHECK
    pub account_14: UncheckedAccount<'info>,

    /// CHECK
    pub account_15: UncheckedAccount<'info>,

    /// CHECK
    pub account_16: UncheckedAccount<'info>,

    /// CHECK
    pub account_17: UncheckedAccount<'info>,

    /// CHECK
    pub account_18: UncheckedAccount<'info>,

    /// CHECK
    pub account_19: UncheckedAccount<'info>,

    /// CHECK
    pub account_20: UncheckedAccount<'info>,
}