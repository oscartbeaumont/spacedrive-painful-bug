#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use std::time::Duration;

use tauri::{ipc::RemoteDomainAccessScope, Manager};

use tokio::time::sleep;

#[tokio::main]
async fn main() -> tauri::Result<()> {
	let app = tauri::Builder::default();

	let app = app
		.setup(|app| {
			let app = app.handle();

			app.windows().iter().for_each(|(_, window)| {
				tokio::spawn({
					let window = window.clone();
					async move {
						sleep(Duration::from_secs(3)).await;
						if !window.is_visible().unwrap_or(true) {
							// This happens if the JS bundle crashes and hence doesn't send ready event.
							println!(
							"Window did not emit `app_ready` event fast enough. Showing window..."
						);
							window.show().expect("Main window should show");
						}
					}
				});
			});

			// Configure IPC for custom protocol
			app.ipc_scope().configure_remote_access(
				RemoteDomainAccessScope::new("localhost")
					.allow_on_scheme("spacedrive")
					.add_window("main"),
			);

			Ok(())
		})
		.build(tauri::generate_context!())?;

	app.run(|_, _| {});
	Ok(())
}
