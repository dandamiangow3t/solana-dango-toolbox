p=♞
echo "$p clean_rebuild start"
directory_path=./target/deploy
so_files=($(find "$directory_path" -maxdepth 1 -type f -name "*.so"))

if [ ${#so_files[@]} -gt 0 ]; then
    for so_file in "${so_files[@]}"; do
        # Extract the filename without extension
        filename=$(basename "$so_file")
        filename_no_ext="${filename%.*}" 
    done
    echo "$p found program file: [$filename_no_ext.so]"
else
    echo "$p could not find program file."
fi
rm -rf ./target/deploy/$filename_no_ext-keypair.json
rm -rf ./target/deploy/$filename_no_ext.so
anchor build
new_program_id=$(solana address -k ./target/deploy/$filename_no_ext-keypair.json)
echo "$p new 'program id': $new_program_id"
find programs -name 'lib.rs' -exec sed -i "s/\([\"'][A-Za-z0-9]\{32,44\}[\"']\)/\"$new_program_id\"/" {} \;
echo "$p replaced 'program id' in [lib.rs]"
find . -name 'Anchor.toml' -exec sed -i "s/\([\"'][A-Za-z0-9]\{32,44\}[\"']\)/\"$new_program_id\"/" {} \;
echo "$p replaced 'program id' in [Anchor.toml]"
anchor build
echo "$p program rebuilt with new 'program id'"
find target -name "$filename_no_ext.json" -exec sed -i "0,/\([\"\'][A-Za-z0-9]\{32,44\}[\"\']\)/s//\"$new_program_id\"/" {} \;
echo "$p replaced 'program id' in [target/idl/$filename_no_ext.json]"
find target -name "$filename_no_ext.ts" -exec sed -i "0,/\([\"\'][A-Za-z0-9]\{32,44\}[\"\']\)/s//\"$new_program_id\"/" {} \;
echo "$p replaced 'program id' in [target/types/$filename_no_ext.ts]"
echo "$p clean_rebuild successful"