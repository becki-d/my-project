export class OfflineManager {
  constructor() {
    this.db = new Dexie('DAW_Projects');
    this.db.version(1).stores({
      projects: 'id,title,lastModified',
      pendingChanges: '++id,projectId'
    });
  }

  async saveProject(project) {
    await this.db.projects.put(project);
    if (navigator.onLine) {
      await this.syncToCloud(project.id);
    }
  }

  async syncToCloud(projectId) {
    const changes = await this.db.pendingChanges
      .where('projectId').equals(projectId).toArray();
    
    await Promise.all(changes.map(change => 
      api.post(`/projects/${projectId}/sync`, change)));
  }
}