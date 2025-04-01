#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod mysolanadapp {
    use super::*;

  pub fn close(_ctx: Context<CloseMysolanadapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.mysolanadapp.count = ctx.accounts.mysolanadapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.mysolanadapp.count = ctx.accounts.mysolanadapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeMysolanadapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.mysolanadapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeMysolanadapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Mysolanadapp::INIT_SPACE,
  payer = payer
  )]
  pub mysolanadapp: Account<'info, Mysolanadapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseMysolanadapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub mysolanadapp: Account<'info, Mysolanadapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub mysolanadapp: Account<'info, Mysolanadapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Mysolanadapp {
  count: u8,
}
