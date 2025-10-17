/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
// Simplified version - no more prompting, just returns admin/admin
// TODO: Remove this file when ml-gradle migration is complete

function promptForAdmin(done) {
  // Always use admin/admin - no prompting needed
  console.log('Using default admin credentials (admin/admin)');
  done('admin', 'admin');
}

module.exports = promptForAdmin;
