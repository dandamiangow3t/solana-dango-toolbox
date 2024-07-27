directory_path=./target/deploy
so_files=($(find "$directory_path" -maxdepth 1 -type f -name "*.so"))

if [ ${#so_files[@]} -gt 0 ]; then
    for so_file in "${so_files[@]}"; do
        # Extract the filename without extension
        filename=$(basename "$so_file")
        filename_no_ext="${filename%.*}" 
    done
else
    echo "$p could not find program file."
fi
solana address -k ./target/deploy/$filename_no_ext-keypair.json