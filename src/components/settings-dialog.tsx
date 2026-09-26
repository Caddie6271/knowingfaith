import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/button";
import { useStudy, type TranslationId } from "@/lib/study-store";

export function TranslationFields() {
  const translation = useStudy((state) => state.translation);
  const esvToken = useStudy((state) => state.esvToken);
  const csbKey = useStudy((state) => state.csbKey);
  const setTranslation = useStudy((state) => state.setTranslation);
  const setEsvToken = useStudy((state) => state.setEsvToken);
  const setCsbKey = useStudy((state) => state.setCsbKey);
  const [esvDraft, setEsvDraft] = useState<string | null>(null);
  const [csbDraft, setCsbDraft] = useState<string | null>(null);
  const esvValue = esvDraft ?? esvToken;
  const csbValue = csbDraft ?? csbKey;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["ESV", "English Standard Version"],
            ["CSB", "Christian Standard Bible"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTranslation(id)}
            className={
              translation === id
                ? "min-h-11 rounded-md bg-brass-deep px-3 text-sm text-paper"
                : "min-h-11 rounded-md border border-line bg-paper px-3 text-sm text-ink"
            }
          >
            {label}
          </button>
        ))}
      </div>
      {translation === "ESV" ? <EsvFields value={esvValue} onChange={setEsvDraft} onSave={() => { setEsvToken(esvValue.trim()); setEsvDraft(null); }} onClear={() => { setEsvToken(""); setEsvDraft(""); }} /> : null}
      {translation === "CSB" ? <CsbFields value={csbValue} onChange={setCsbDraft} onSave={() => { setCsbKey(csbValue.trim()); setCsbDraft(null); }} onClear={() => { setCsbKey(""); setCsbDraft(""); }} /> : null}
    </div>
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

function CsbFields({
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
        Holman does not hand out a CSB file. The licensed path is API.Bible. Sign up at scripture.api.bible,
        use the free Starter plan while this stays non-commercial, and add the Christian Standard Bible.
        Paste that API key here. A product that charges needs their paid plan.
      </p>
      <label className="mt-4 block text-sm font-medium" htmlFor="csb-key">
        API.Bible key
      </label>
      <input
        id="csb-key"
        type="password"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Key from scripture.api.bible"
        className="mt-2 w-full rounded-md border border-line bg-parchment px-3 py-3 text-sm"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={onSave}>Save CSB key</Button>
        <Button tone="line" onClick={onClear}>
          Remove
        </Button>
      </div>
    </div>
  );
}

export function SettingsDialog() {
  const translation = useStudy((state) => state.translation);
  const esvToken = useStudy((state) => state.esvToken);
  const csbKey = useStudy((state) => state.csbKey);
  const ready = useStudy((state) => state.ready);
  const on = translation === "ESV" ? esvToken.trim().length > 0 : csbKey.trim().length > 0;
  const label: TranslationId | "Text" = ready && on ? translation : "Text";

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
            Knowing Faith reads the ESV or the CSB from the publisher’s API. The text is not stored here, and
            no other translation is used in its place.
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
