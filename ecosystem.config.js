module.exports = {
  apps: [{
    name: 'tapestry-vertical-gardens',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/tapestry-vertical-gardens',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      REDIS_PASSWORD: 'LfL4l3Y6rTqzaudi',
      JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345',
      SESSION_SECRET: process.env.SESSION_SECRET || '68b690d96db8d',
      ADMIN_SECRET: process.env.ADMIN_SECRET || '68b690cb09695'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
