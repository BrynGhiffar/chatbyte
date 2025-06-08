#![allow(dead_code)]
mod app;
mod middleware;
mod repository;
mod req_model;
mod routes;
mod run;
mod service;
mod utility;
mod websocket;
use mimalloc::MiMalloc;
// use entities::{ prelude::*, * };

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

#[tokio::main(flavor = "current_thread")]
async fn main() -> std::io::Result<()> {
    // run::run().await
    run::axum_run().await;
    Ok(())
}
