import React, { useState } from 'react'

export function MultiSelect({
    id, options, value, searchable, onChange
}: {
    id: string
    options: (string | { label: string; value: string })[]
    value: string[]
    searchable: boolean
    onChange: (value: string[]) => void
}) {
    const [search, setSearch] = useState('')

    const items = options.map((opt) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    )

    const filtered = searchable
        ? items.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
        : items

    const toggle = (v: string) =>
        onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

    return (
        <div className="multiselect-wrapper" id={id}>
            {searchable && (
                <input
                    type='text'
                    placeholder='search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='search-input'
                />
            )}
            <div className='options-list'>
                {filtered.map((opt) => (
                    <div
                        key={opt.value}
                        className={`option-item ${value.includes(opt.value) ? 'selected' : ''}`}
                        onClick={() => toggle(opt.value)}
                    >
                        {opt.label}
                    </div>
                ))}
                {value.length > 0 &&
                    <div className='selected-items'>
                        {value.map((v) => (
                            <span key={v} className="tag">
                                {items.find((o) => o.value === v)?.label ?? v}
                                <button onClick={() => onChange(value.filter((x) => x !== v))} type="button">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                }
            </div>
        </div>
    )

}

