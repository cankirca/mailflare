"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type ComposeContextValue = {
	open: boolean;
	draftId: string | null;
	openComposer: () => void;
	openDraftComposer: (draftId: string) => void;
	closeComposer: () => void;
	notice: string | null;
	showNotice: (message: string) => void;
};

const ComposeContext = createContext<ComposeContextValue | null>(null);

export function useCompose() {
	const ctx = useContext(ComposeContext);
	if (!ctx) throw new Error("useCompose must be used within ComposeProvider");
	return ctx;
}

export function ComposeProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [draftId, setDraftId] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);

	useEffect(() => {
		if (!notice) return;
		const timer = setTimeout(() => setNotice(null), 3200);
		return () => clearTimeout(timer);
	}, [notice]);

	return (
		<ComposeContext.Provider
			value={{
				open,
				draftId,
				openComposer: () => {
					setDraftId(null);
					setOpen(true);
				},
				openDraftComposer: (nextDraftId) => {
					setDraftId(nextDraftId);
					setOpen(true);
				},
				closeComposer: () => {
					setOpen(false);
					setDraftId(null);
				},
				notice,
				showNotice: setNotice,
			}}
		>
			{children}
		</ComposeContext.Provider>
	);
}
