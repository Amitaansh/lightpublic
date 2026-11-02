import type { CSSProperties, ReactNode } from 'react'
import type { ChapterDef } from '@/lib/chapters'

type Props = {
  def: Pick<ChapterDef, 'key' | 'id' | 'n' | 'theme'>
  /** Which side the copy sits on; the baton takes the other rail. */
  rail?: 'left' | 'right' | 'none'
  /** Pinned chapters are taller than the viewport; their content sticks while the scroll drives the scene. */
  pinned?: string
  /** The rig keyframe to use, if different from the chapter key. */
  keyframe?: string
  className?: string
  children: ReactNode
}

/**
 * A chapter section (docs/04 §3). The chapter tracker reads the data
 * attributes to set the page theme and drive the 3D rig.
 */
export function Chapter({ def, rail = 'left', pinned, keyframe, className, children }: Props) {
  const style: CSSProperties | undefined = pinned ? { height: pinned } : undefined
  return (
    <section
      id={def.id}
      data-chapter={def.key}
      data-keyframe={keyframe}
      data-chapter-theme={def.theme}
      data-n={def.n}
      data-pinned={pinned ? 'true' : undefined}
      aria-labelledby={`${def.id}-title`}
      className={`chapter rail-${rail} ${pinned ? 'chapter--pinned' : ''} ${className ?? ''}`}
      style={style}
    >
      {pinned ? (
        <div className="pin-sticky">
          <div className="chapter__inner">{children}</div>
        </div>
      ) : (
        <div className="chapter__inner">{children}</div>
      )}
    </section>
  )
}
