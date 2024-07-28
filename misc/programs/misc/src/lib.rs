pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("7n3wgvGfKggxeL8McTFNpi1XqBHqhToHwr55SVjrNvHy");

#[program]
pub mod misc {
    use super::*;

    pub fn init_some_config(ctx: Context<InitSomeConfig>) -> Result<()> {
        InitSomeConfig::handler(ctx)
    }

    pub fn do_something_part_one(ctx: Context<DoSomethinPartOne>, amount: u16) -> Result<()> {
        DoSomethinPartOne::handler(ctx, amount)
    }

    pub fn do_something_part_two(ctx: Context<DoSomethingPartTwo>) -> Result<()> {
        DoSomethingPartTwo::handler(ctx)
    }
}
