# solana-dango-toolbox

## Solana Dango's Toolbox

### Index

- *deployment-scripts* - Fast & fresh deployment of a program to any cluster; Tests upgraded to run in this context.
- *limits* - Methods for testing various limits for an ix or a tx.
- *misc* - Methods for testing various cases:
  - test showing that an account is updated in the same tx, across many ix

### Notes

1. Check that the PDA passed to an instruction is the correct one (no Anchor implementation).

```
 let (pda, _) = Pubkey::find_program_address(&[&AMM_CONFIG_SEED], program_id);
        if pda != *amm_config_info.key || amm_config_info.owner != program_id {
            return Err(AmmError::InvalidConfigAccount.into());
        }
```
source: https://github.com/raydium-io/raydium-amm/blob/master/program/src/processor.rs#L870-L873