# Deployment scripts

## This repo contains bash scripts used for a fast and fresh deployment on Devnet or other clusters

### How to run

Install dependencies

```bash
$yarn
```

Define the `env` variables in `.env` file: `RPC_ENDPOINT` and `CLUSTER`

Deploy the program

```bash
yarn deploy
```

Runt the tests
```bash
yarn test
```

Obs:

For tests to run, you need to add the following options in `tsconfig.json`:

```
{
  "compilerOptions": {
    ...
    "lib": [..., "dom"],
    ...
    "resolveJsonModule": true
  }
}
```


### Problem

Given that I want to test my program on devnet and given that often, updating the previously deployed program is not trivial, 
I prefer doing a fresh deployment each time (i.e. the program having a new id).

### Solution

To accomplish this, running `yarn deploy` will call first `bash clean_rebuild.sh` and then `bash deploy.sh`.

`clean_rebuild.sh` does the following:

- searches in `target/deploy` the file with the `.so` extension to get the program name

- removes from `target/deploy` existent `program-keypair.json` and `program.so` files

- rebuilds the program with Anchor, so everything is regenerated in `target/` (including a new program id in the `deploy/program-keypair.json`)

- gets the new program id from the `target/deploy/program-keypair.json` file

- replaces the new program id everywhere it's needed: `lib.rs`, `Anchor.toml`, `target/idl/program.json` and `target/types/program.ts`

then `deploy.sh` simply runs `solana program deploy target/deploy/program.so`.