import { forwardRef, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import type { InputFeedback, InputRadius } from '../Input';
import { DropzoneRoot, DropzoneIcon, DropzoneLabel, DropzoneHint, HiddenFileInput } from './Dropzone.styles';

export interface DropzoneProps {
  /** Accepted file types, in the same syntax as the `accept` attribute. */
  accept?: string;
  /** Allows picking more than one file. */
  multiple?: boolean;
  disabled?: boolean;
  /** Fired with the chosen files, from the picker or from a drop. */
  onFilesSelected?: (files: File[]) => void;
  /** Main line of text. */
  label?: ReactNode;
  /** Secondary line, for accepted formats or size limits. */
  hint?: ReactNode;
  /** Validation state, colored by the matching feedback role. */
  feedback?: InputFeedback;
  /** Shorthand for `feedback="critical"`. */
  invalid?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  /** Replaces the default icon. */
  icon?: ReactNode;
  className?: string;
  /** Name forwarded to the underlying file input, for plain form posts. */
  name?: string;
  id?: string;
}

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * File drop area with a click-to-browse fallback.
 *
 * The whole surface is a `<button>`, so it is reachable and operable by
 * keyboard; the file input behind it stays in the DOM (hidden) so the control
 * still posts in a plain form.
 */
export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(function Dropzone(
  {
    accept,
    multiple = false,
    disabled = false,
    onFilesSelected,
    label = 'Arraste um arquivo ou clique para escolher',
    hint,
    feedback,
    invalid = false,
    radius = 'default',
    fullWidth = false,
    icon,
    className,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const role = feedback ?? (invalid ? 'critical' : undefined);

  const emit = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFilesSelected?.(Array.from(list));
  };

  const stop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <DropzoneRoot
      type="button"
      className={className}
      data-feedback={role}
      $dragging={dragging}
      $radius={radius}
      $fullWidth={fullWidth}
      $feedback={Boolean(role)}
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        stop(event);
        if (!disabled) setDragging(true);
      }}
      onDragOver={stop}
      onDragLeave={(event) => {
        stop(event);
        setDragging(false);
      }}
      onDrop={(event) => {
        stop(event);
        setDragging(false);
        if (!disabled) emit(event.dataTransfer.files);
      }}
    >
      <DropzoneIcon aria-hidden="true">{icon ?? <UploadIcon />}</DropzoneIcon>
      <DropzoneLabel>{label}</DropzoneLabel>
      {hint && <DropzoneHint>{hint}</DropzoneHint>}
      <HiddenFileInput
        {...rest}
        ref={(node: HTMLInputElement | null) => {
          inputRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
        }}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        onChange={(event) => emit(event.target.files)}
      />
    </DropzoneRoot>
  );
});

Dropzone.displayName = 'Dropzone';
