import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  createConnection,
  Connection,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import AdminJs from 'adminjs'
import { Database, Resource } from '@adminjs/typeorm'

export const registerDatabase = async (secrets: any): Promise<Connection> => {
  AdminJs.registerAdapter({ Database, Resource })

  let host = 'localhost'
  if (process.env.K_SERVICE) {
    console.log(
      'connecting to database via Cloud Run connection',
      process.env.CLOUD_SQL_CONNECTION_NAME
    )
    const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql'
    host = `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`
  }

  console.log('connecting to database:', {
    type: 'postgres',
    host: host,
    schema: 'omnivore',
    database: secrets.DB_DATABASE,
  })

  const connection = await createConnection({
    type: 'postgres',
    host: host,
    schema: 'omnivore',
    username: secrets.DB_USER,
    password: secrets.DB_PASS,
    database: secrets.DB_DATABASE,
    entities: [
      AdminUser,
      User,
      UserProfile,
      UserArticle,
      ReceivedEmail,
      ContentDisplayReport,
    ],
  })

  return connection
}

export enum StatusType {
  Active = 'ACTIVE',
  Pending = 'PENDING',
}

@Entity({ name: 'admin_user' })
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: string

  @Column({ type: 'text' })
  public email!: string

  @Column({ type: 'text' })
  public password!: string
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  name!: string

  @Column({ type: 'text' })
  public email!: string

  @Column({ type: 'timestamp' })
  public created_at!: Date

  @Column({ type: 'timestamp' })
  public updated_at!: Date

  @Column({ type: 'enum', enum: StatusType })
  status!: StatusType

  @OneToMany(() => UserArticle, (ua) => ua.user)
  articles!: UserArticle[]
}

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  public username!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  user!: User
}

@Entity({ name: 'user_articles' })
export class UserArticle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  user!: User

  @Column({ type: 'text', name: 'article_id' })
  articleId!: string

  @Column({ type: 'text' })
  slug!: string

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date

  @Column({ type: 'timestamp', name: 'saved_at' })
  savedAt!: Date
}

@Entity({ name: 'content_display_report' })
export class ContentDisplayReport extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  user!: User

  @Column({ type: 'text', name: 'original_url' })
  originalUrl!: string

  @Column({ type: 'text', name: 'report_comment' })
  reportComment!: string

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date
}

@Entity({ name: 'received_emails' })
export class ReceivedEmail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  user!: User

  @Column('text')
  from!: string

  @Column('text')
  to!: string

  @Column('text')
  subject!: string

  @Column('text')
  text!: string

  @Column('text')
  html!: string

  @Column('text')
  type!: 'article' | 'non-article'

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date
}
