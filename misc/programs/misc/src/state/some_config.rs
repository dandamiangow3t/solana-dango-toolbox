use anchor_lang::prelude::*;

#[account]
pub struct SomeConfig {

  pub amount: u16,
  
  pub bump: u8
}

impl SomeConfig {
  pub fn size() -> usize {
    8  +     // anchor account discriminator
    2 +      // amount
    1        // bump
  }
}