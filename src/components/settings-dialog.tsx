import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/button";
import { useStudy } from "@/lib/study-store";

export function TranslationFields() {
  const esvToken = useStudy((state) => state.esvToken);
  const setEsvToken = useStudy((state) => state.setEsvToken);
  const [esvDraft, setEsvDraft] = useState<string | null>(null);
  const esvValue = esvDraft ?? esvToken;

  return (
    <EsvFields
      value={esvValue}
      onChange={setEsvDraft}
      onSave={() => {
        setEsvToken(esvValue.trim());
        setEsvDraft(null);
      }}
      onClear={() => {
        setEsvToken("");
        setEsvDraft("");
      }}
    />
  );
}

function EsvFields({
  value,
  onChange,
  onSave,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        Crossway serves the ESV from their API. It is free for non-commercial use. Create an application at
        api.esv.org, then paste the token. A paid product needs a license from Crossway, and they license
        organizations rather than solo developers.
      </p>
      <label className="mt-4 block text-sm font-medium" htmlFor="esv-token">
        ESV API token
      </label>
      <input
        id="esv-token"
        type="password"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Token from api.esv.org"
        className="mt-2 w-full rounded-md border border-line bg-parchment px-3 py-3 text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={onSave}>Save ESV token</Button>
        <Button tone="line" onClick={onClear}>
          Remove
        </Button>
      </div>
    </div>
  );
}

export function SettingsDialog() {
  const esvToken = useStudy((state) => state.esvToken);
  const ready = useStudy((state) => state.ready);
  const label = ready && esvToken.trim().length > 0 ? "ESV" : "Text";

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex min-h-11 items-center rounded-md px-2 text-sm text-ink-soft hover:text-ink">
        {label}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[min(100%-2rem,40rem)] w-[min(100%-2rem,36rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-line bg-paper p-6 text-ink">
          <Dialog.Title className="font-serif text-3xl">Licensed text</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted">
            Knowing Faith reads the ESV from Crossway. The text is not stored here, and no other translation is
            used in its place.
          </Dialog.Description>
          <div className="mt-5">
            <TranslationFields />
          </div>
          <Dialog.Close className="mt-4 inline-flex min-h-11 items-center px-1 text-sm text-muted">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
