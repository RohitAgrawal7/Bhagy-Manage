import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export function Field({
  label,
  children,
  required,
}: {
  label: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label}
        {required ? <span className="text-danger-500"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[88px] resize-y ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ''}`} />
  )
}

export function FormActions({
  onCancel,
  submitLabel = 'Save',
}: {
  onCancel: () => void
  submitLabel?: string
}) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-border pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-steel-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800"
      >
        {submitLabel}
      </button>
    </div>
  )
}
