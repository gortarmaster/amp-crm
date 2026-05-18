'use client'

import { useState, useTransition } from 'react'
import { Edit2, Trash2, Users, X, MapPin, Tag, DollarSign, Calendar } from 'lucide-react'
import {
  updateProject,
  deleteProject,
  updateProjectVisibility,
  addProjectContact,
  removeProjectContact,
} from '../actions'
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge'
import type { ProjectWithDetails, Company, ProjectStatus } from '@/lib/supabase/database.types'

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'booked', label: 'Booked' },
  { value: 'shooting', label: 'Shooting' },
  { value: 'editing', label: 'Editing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'archived', label: 'Archived' },
]

const CATEGORIES = ['Wedding', 'Portrait', 'Commercial', 'Events', 'Family', 'Boudoir', 'Editorial', 'Other']

interface Props {
  project: ProjectWithDetails
  companies: Pick<Company, 'id' | 'name'>[]
  allContacts: { id: string; first_name: string; last_name: string }[]
}

export default function ProjectDetail({ project, companies, allContacts }: Props) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [addContactId, setAddContactId] = useState('')

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateProject(project.id, formData)
      setEditing(false)
    })
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteProject(project.id)
    })
  }

  function handleToggle(field: 'portfolio_visible' | 'client_gallery_enabled', value: boolean) {
    startTransition(async () => {
      await updateProjectVisibility(project.id, project.slug, field, value)
    })
  }

  function handleAddContact() {
    if (!addContactId) return
    startTransition(async () => {
      await addProjectContact(project.id, addContactId)
      setAddContactId('')
    })
  }

  function handleRemoveContact(contactId: string) {
    startTransition(async () => {
      await removeProjectContact(project.id, contactId)
    })
  }

  const associatedContactIds = new Set(project.project_contacts.map((pc) => pc.contact_id))
  const availableContacts = allContacts.filter((c) => !associatedContactIds.has(c.id))

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left — project info + contacts */}
      <div className="flex-1 overflow-y-auto border-r border-line px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Project Info
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="inline-flex items-center gap-1.5 rounded-token-md border border-line px-3 py-1.5 text-caption font-medium text-ink-secondary transition-colors hover:border-gold/30 hover:text-gold"
            >
              <Edit2 size={12} />
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-token-md border border-line px-3 py-1.5 text-caption font-medium text-ink-muted transition-colors hover:border-red-900/40 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        {editing ? (
          <form action={handleUpdate} className="space-y-4">
            <EditField label="Project Title" name="title" defaultValue={project.title} required />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={project.status}
                  className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={project.category ?? ''}
                  className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Company
              </label>
              <select
                name="company_id"
                defaultValue={project.company_id ?? ''}
                className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              >
                <option value="">No company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EditField label="Shoot Date" name="shoot_date" type="date" defaultValue={project.shoot_date ?? ''} />
              <EditField label="Delivery Date" name="delivery_date" type="date" defaultValue={project.delivery_date ?? ''} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EditField label="Value ($)" name="deal_value" type="number" defaultValue={project.deal_value?.toString() ?? ''} placeholder="0" />
              <EditField label="Location" name="location" defaultValue={project.location ?? ''} placeholder="City, State" />
            </div>

            <div>
              <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                Internal Notes
              </label>
              <textarea
                name="internal_notes"
                rows={4}
                defaultValue={project.internal_notes ?? ''}
                className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />
            </div>

            {/* CMS fields */}
            <div className="border-t border-line pt-4">
              <p className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
                Portfolio / Client Info
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                    Public Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={project.description ?? ''}
                    className="w-full resize-none rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                  />
                </div>
                <EditField label="Year" name="year" type="number" defaultValue={project.year?.toString() ?? ''} placeholder={new Date().getFullYear().toString()} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-token-md bg-gold px-5 py-2 text-caption font-semibold text-bg-base transition-colors hover:bg-gold-light disabled:opacity-50"
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-token-md border border-line px-5 py-2 text-caption font-medium text-ink-secondary transition-colors hover:text-ink-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-5">
            <InfoRow icon={Tag} label="Category" value={project.category} />
            <InfoRow icon={MapPin} label="Location" value={project.location} />
            <InfoRow
              icon={DollarSign}
              label="Value"
              value={
                project.deal_value != null
                  ? `$${project.deal_value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  : null
              }
            />
            <InfoRow
              icon={Calendar}
              label="Shoot Date"
              value={
                project.shoot_date
                  ? new Date(project.shoot_date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
                    })
                  : null
              }
            />
            <InfoRow
              icon={Calendar}
              label="Delivery"
              value={
                project.delivery_date
                  ? new Date(project.delivery_date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
                    })
                  : null
              }
            />
            {project.companies && (
              <InfoRow label="Company" value={project.companies.name} />
            )}
          </dl>
        )}

        {/* People */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-caption font-semibold uppercase tracking-widest text-ink-muted">
              People
            </h2>
          </div>

          {project.project_contacts.length > 0 ? (
            <div className="mb-3 space-y-1">
              {project.project_contacts.map((pc) => (
                <div
                  key={pc.contact_id}
                  className="flex items-center justify-between rounded-token-md px-3 py-2.5 transition-colors hover:bg-bg-hover/60"
                >
                  <div>
                    <p className="text-caption font-medium text-ink-primary">
                      {pc.contacts.first_name} {pc.contacts.last_name}
                    </p>
                    {pc.role && (
                      <p className="mt-0.5 text-ink-muted" style={{ fontSize: '11px' }}>{pc.role}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveContact(pc.contact_id)}
                    disabled={isPending}
                    className="text-ink-muted transition-colors hover:text-red-400 disabled:opacity-50"
                    title="Remove from project"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-3 flex flex-col items-center gap-2 py-6 text-center">
              <Users size={18} strokeWidth={1.5} className="text-ink-muted" />
              <p className="text-caption text-ink-muted">No people added yet</p>
            </div>
          )}

          {availableContacts.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={addContactId}
                onChange={(e) => setAddContactId(e.target.value)}
                className="flex-1 rounded-token-md border border-line bg-bg-card px-3 py-2 text-caption text-ink-primary transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              >
                <option value="">Add a contact…</option>
                {availableContacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddContact}
                disabled={!addContactId || isPending}
                className="rounded-token-md border border-gold/30 px-3 py-2 text-caption font-medium text-gold transition-colors hover:bg-gold/5 disabled:opacity-40"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar — CMS toggles, notes, metadata */}
      <div className="w-72 flex-shrink-0 overflow-y-auto px-6 py-6">
        {/* Visibility toggles */}
        <h2 className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
          Visibility
        </h2>
        <div className="space-y-3">
          <TogglePill
            label="Portfolio"
            description="Show on public website"
            checked={project.portfolio_visible}
            onChange={(v) => handleToggle('portfolio_visible', v)}
            disabled={isPending}
          />
          <TogglePill
            label="Client Gallery"
            description="Enable shareable gallery link"
            checked={project.client_gallery_enabled}
            onChange={(v) => handleToggle('client_gallery_enabled', v)}
            disabled={isPending}
          />
        </div>

        {project.client_gallery_enabled && (
          <div className="mt-3 rounded-token-md border border-line bg-bg-card p-3">
            <p className="mb-1 text-caption font-medium text-ink-secondary">Gallery URL</p>
            <p className="break-all text-ink-muted" style={{ fontSize: '11px' }}>
              /p/{project.slug}/gallery
            </p>
          </div>
        )}

        {/* Description preview */}
        {project.description && (
          <div className="mt-6">
            <h2 className="mb-3 text-caption font-semibold uppercase tracking-widest text-ink-muted">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-caption text-ink-secondary">
              {project.description}
            </p>
          </div>
        )}

        {/* Internal notes */}
        <div className="mt-6">
          <h2 className="mb-4 text-caption font-semibold uppercase tracking-widest text-ink-muted">
            Internal Notes
          </h2>
          <div className="min-h-[100px] rounded-token-md border border-line bg-bg-card p-4">
            {project.internal_notes ? (
              <p className="whitespace-pre-wrap text-caption text-ink-secondary">
                {project.internal_notes}
              </p>
            ) : (
              <p className="text-caption italic text-ink-muted">No notes yet.</p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 space-y-2">
          <MetaRow
            label="Created"
            value={new Date(project.created_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          />
          <MetaRow
            label="Updated"
            value={new Date(project.updated_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          />
          {project.year && <MetaRow label="Year" value={String(project.year)} />}
          <MetaRow label="Slug" value={project.slug} />
        </div>
      </div>
    </div>
  )
}

function TogglePill({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-token-md border px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
        checked
          ? 'border-gold/30 bg-gold/5'
          : 'border-line hover:border-gold/20'
      }`}
    >
      <div>
        <p className={`text-caption font-medium ${checked ? 'text-gold' : 'text-ink-secondary'}`}>
          {label}
        </p>
        <p className="mt-0.5 text-ink-muted" style={{ fontSize: '11px' }}>{description}</p>
      </div>
      <div
        className={`h-4 w-7 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-line'}`}
      >
        <div
          className={`mt-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>
  label: string
  value: string | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-ink-muted" />
      )}
      <div>
        <dt style={{ fontSize: '11px' }} className="text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-caption text-ink-primary">{value}</dd>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: '11px' }} className="text-ink-muted">{label}</span>
      <span style={{ fontSize: '11px' }} className="text-ink-muted">{value}</span>
    </div>
  )
}

function EditField({
  label,
  name,
  type = 'text',
  defaultValue,
  required = false,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  defaultValue: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-token-md border border-line bg-bg-card px-3 py-2.5 text-caption text-ink-primary placeholder:text-ink-muted transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}
