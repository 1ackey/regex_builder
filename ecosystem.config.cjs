module.exports = {
  apps: [{
    name: 'regex-builder',
    cwd: '/home/appuser/regex_builder',
    script: 'npm',
    args: 'run dev',
    env: {
      PORT: 5001,
      NODE_ENV: 'production',
      HOST: '0.0.0.0'
    },
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}