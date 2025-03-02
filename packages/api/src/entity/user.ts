import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { RegistrationType, StatusType } from '../datalayer/user/model'
import { NewsletterEmail } from './newsletter_email'
import { Profile } from './profile'
import { Label } from './label'
import { Subscription } from './subscription'
import { UserPersonalization } from './user_personalization'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  name!: string

  @Column({ type: 'enum', enum: RegistrationType })
  source!: string

  @Column('text')
  email!: string

  @Column('text')
  sourceUserId!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => NewsletterEmail, (newsletterEmail) => newsletterEmail.user)
  newsletterEmails?: NewsletterEmail[]

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile

  @Column('varchar', { length: 255, nullable: true })
  password?: string

  @OneToMany(() => Label, (label) => label.user)
  labels?: Label[]

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions?: Subscription[]

  @Column({ type: 'enum', enum: StatusType })
  status!: StatusType

  @OneToOne(
    () => UserPersonalization,
    (userPersonalization) => userPersonalization.user
  )
  userPersonalization!: UserPersonalization
}
