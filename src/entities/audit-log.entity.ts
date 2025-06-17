import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    orgId: string;

    @Column()
    userId: string;

    @Column({ type: 'json', nullable: true })
    header: Record<string, any>;

    @Column({ type: 'json', nullable: true })
    requestBody: Record<string, any>;

    @Column({ type: 'varchar', length: 50 })
    action: string;

    @Column({ type: 'varchar', length: 200 })
    httpUrl: string;

    @Column({ type: 'varchar', length: 50 })
    responseCode: string;

    @Column({ type: 'json', nullable: true })
    responseBody: Record<string, any>;

    @Column({ type: 'varchar', length: 50, nullable: true })
    ipAddress: string;

    @Column({ type: 'json', nullable: true })
    logs: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

}
