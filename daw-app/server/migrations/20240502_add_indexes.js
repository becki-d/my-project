exports.up = async (knex) => {
  // Covering index for user dashboard (faster "My Projects" load)
  await knex.raw(`
    CREATE INDEX CONCURRENTLY idx_projects_user 
    ON projects(user_id)
    INCLUDE (title, created_at)
    WHERE deleted_at IS NULL
  `);

  // Optimized collaboration checks
  await knex.raw(`
    CREATE INDEX CONCURRENTLY idx_collaborators_user_project
    ON collaborators(user_id, project_id)
    WHERE permission IN ('owner', 'editor')
  `);

  // Time-based contribution analytics
  await knex.raw(`
    CREATE INDEX CONCURRENTLY idx_contributions_project_created
    ON contributions(project_id, created_at)
    WHERE deleted_at IS NULL
  `);

  // Revenue distribution calculations
  await knex.raw(`
    CREATE INDEX CONCURRENTLY idx_contributions_user_weight
    ON contributions(user_id, weight)
    WHERE created_at > NOW() - INTERVAL '30 days'
  `);
};

exports.down = async (knex) => {
  await knex.raw('DROP INDEX IF EXISTS idx_projects_user');
  await knex.raw('DROP INDEX IF EXISTS idx_collaborators_user_project');
  await knex.raw('DROP INDEX IF EXISTS idx_contributions_project_created');
  await knex.raw('DROP INDEX IF EXISTS idx_contributions_user_weight');
};