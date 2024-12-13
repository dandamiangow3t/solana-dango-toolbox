use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn main() {
    // Concurrent execution of both API simulations
    let (users, products) = tokio::join!(fetch_users(), fetch_products());

    println!("Fetched users: {:?}", users);
    println!("Fetched products: {:?}", products);
}

async fn fetch_users() -> Vec<String> {
    let mut users = Vec::new();
    
    // Generate users one by one with delay
    for i in 1..=5 {
        sleep(Duration::from_secs(1)).await;
        users.push(format!("user_{}", i));
        println!("User {} fetched!", i);
    }

    println!("All users fetched!");
    users
}

async fn fetch_products() -> Vec<String> {
    let mut products = Vec::new();
    
    // List of product names to add
    let product_names = ["Phone", "Laptop", "Headphones", "Mouse"];
    
    // Generate products one by one with delay
    for (i, product) in product_names.iter().enumerate() {
        sleep(Duration::from_secs(2)).await;
        products.push(product.to_string());
        println!("Product {} ({}) fetched!", i + 1, product);
    }

    println!("All products fetched!");
    products
}
