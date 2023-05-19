export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  postgres: {
    host: process.env.POSTGRES_HOST,
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
  },
});
