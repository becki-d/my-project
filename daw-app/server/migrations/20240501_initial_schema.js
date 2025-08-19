exports.up = async (knex) => {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });

  // Projects table
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.string('title').notNullable();
    table.jsonb('audio_data'); // Stores compressed audio blobs
    table.jsonb('midi_data');  // MIDI sequence data
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });

  // Collaborators (many-to-many)
  await knex.schema.createTable('collaborators', (table) => {
    table.uuid('project_id').references('id').inTable('projects').notNullable();
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.enum('permission', ['owner', 'editor', 'viewer']).notNullable();
    table.timestamps(true, true);
    table.primary(['project_id', 'user_id']);
  });

  // Contributions tracking
  await knex.schema.createTable('contributions', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.uuid('project_id').references('id').inTable('projects').notNullable();
    table.string('action_type').notNullable(); // 'note-edit', 'audio-record'
    table.float('weight').notNullable(); // For revenue distribution
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('contributions');
  await knex.schema.dropTable('collaborators');
  await knex.schema.dropTable('projects');
  await knex.schema.dropTable('users');
};