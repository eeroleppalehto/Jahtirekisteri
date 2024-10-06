import { create } from "zustand";
import {
    JasenForm,
    GroupFormType,
    PartyFormType,
    ShotUsageForm,
    MembershipFormType,
    MemberShareFormType,
    GroupShareFormType,
} from "../types";

type MemberFormStoreActions = {
    updateFirstName: (firstName: string | undefined) => void;
    updateLastName: (lastName: string | undefined) => void;
    updateAddress: (address: string | undefined) => void;
    updateZipCode: (zipCode: string | undefined) => void;
    updateCity: (city: string | undefined) => void;
    updatePhoneNumber: (phoneNumber: string | undefined) => void;
    updateMemberState: (memberState: string | undefined) => void;
    clearForm: () => void;
};

export const useMemberFormStore = create<JasenForm & MemberFormStoreActions>(
    (set) => ({
        etunimi: undefined,
        sukunimi: undefined,
        jakeluosoite: undefined,
        postinumero: undefined,
        postitoimipaikka: undefined,
        puhelinnumero: undefined,
        tila: undefined,
        updateFirstName: (firstName: string | undefined) =>
            set(() => ({ etunimi: firstName })),
        updateLastName: (lastName: string | undefined) =>
            set(() => ({ sukunimi: lastName })),
        updateAddress: (address: string | undefined) =>
            set(() => ({ jakeluosoite: address })),
        updateZipCode: (zipCode: string | undefined) =>
            set(() => ({ postinumero: zipCode })),
        updateCity: (city: string | undefined) =>
            set(() => ({ postitoimipaikka: city })),
        updatePhoneNumber: (phoneNumber: string | undefined) =>
            set(() => ({ puhelinnumero: phoneNumber })),
        updateMemberState: (memberState: string | undefined) =>
            set(() => ({ tila: memberState })),
        clearForm: () =>
            set({
                etunimi: "",
                sukunimi: "",
                jakeluosoite: "",
                postinumero: "",
                postitoimipaikka: "",
                puhelinnumero: "",
                tila: "",
            }),
    })
);

type GroupFormStoreActions = {
    updateGroupName: (groupName: string | undefined) => void;
    updatePartyId: (partyId: number | undefined) => void;
    clearForm: () => void;
};

export const useGroupFormStore = create<GroupFormType & GroupFormStoreActions>(
    (set) => ({
        ryhman_nimi: undefined,
        seurue_id: undefined,
        updateGroupName: (groupName: string | undefined) =>
            set(() => ({ ryhman_nimi: groupName })),
        updatePartyId: (partyId: number | undefined) =>
            set(() => ({ seurue_id: partyId })),
        clearForm: () =>
            set({
                ryhman_nimi: "",
                seurue_id: undefined,
            }),
    })
);

type PartyFormStoreActions = {
    updatePartyName: (partyName: string | undefined) => void;
    updatePartyLeader: (partyLeaderId: number | undefined) => void;
    updatePartyType: (partyTypeId: number | undefined) => void;
    clearForm: () => void;
};

export const usePartyFormStore = create<PartyFormType & PartyFormStoreActions>(
    (set) => ({
        seurueen_nimi: undefined,
        jasen_id: undefined,
        seurue_tyyppi_id: undefined,
        updatePartyName: (partyName: string | undefined) =>
            set(() => ({ seurueen_nimi: partyName })),
        updatePartyLeader: (partyLeaderId: number | undefined) =>
            set(() => ({ jasen_id: partyLeaderId })),
        updatePartyType: (partyTypeId: number | undefined) =>
            set(() => ({ seurue_tyyppi_id: partyTypeId })),
        clearForm: () =>
            set({
                seurueen_nimi: "",
                jasen_id: undefined,
                seurue_tyyppi_id: undefined,
            }),
    })
);

type ShotFormStoreActions = {
    updateShooterId: (shooterId: number | undefined) => void;
    updateShotDate: (shotDate: string | undefined) => void;
    updateWeight: (weight: number | undefined) => void;
    updateLocationText: (text: string | undefined) => void;
    updateAnimal: (text: string | undefined) => void;
    updateGender: (text: string | undefined) => void;
    updateAgeGroup: (text: string | undefined) => void;
    updateInfo: (text: string | undefined) => void;
    updateFirstUsage: (id: number | undefined) => void;
    updateFirstUsageAmount: (value: number) => void;
    updateSecondUsage: (id: number | undefined) => void;
    updateSecondUsageAmount: (value: number) => void;
    resetSecondUsage: () => void;
    clearForm: () => void;
};

export const useShotFormStore = create<ShotUsageForm & ShotFormStoreActions>(
    (set) => ({
        shot: {
            jasen_id: undefined,
            kaatopaiva: "",
            ruhopaino: undefined,
            paikka_teksti: "",
            elaimen_nimi: "",
            sukupuoli: "",
            ikaluokka: "",
            lisatieto: "",
        },
        usages: [
            {
                kasittelyid: undefined,
                kasittely_maara: 100,
            },
            {
                kasittelyid: undefined,
                kasittely_maara: 0,
            },
        ],
        updateShooterId: (shooterId: number | undefined) =>
            set((state) => ({ shot: { ...state.shot, jasen_id: shooterId } })),
        updateShotDate: (shotDate: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, kaatopaiva: shotDate } })),
        updateWeight: (weight: number | undefined) =>
            set((state) => ({ shot: { ...state.shot, ruhopaino: weight } })),
        updateLocationText: (text: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, paikka_teksti: text } })),
        updateAnimal: (text: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, elaimen_nimi: text } })),
        updateGender: (text: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, sukupuoli: text } })),
        updateAgeGroup: (text: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, ikaluokka: text } })),
        updateInfo: (text: string | undefined) =>
            set((state) => ({ shot: { ...state.shot, lisatieto: text } })),
        updateFirstUsage: (id: number | undefined) =>
            set((state) => ({
                usages: [
                    { ...state.usages[0], kasittelyid: id },
                    { ...state.usages[1] },
                ],
            })),
        updateFirstUsageAmount: (value: number) =>
            set((state) => ({
                usages: [
                    { ...state.usages[0], kasittely_maara: value },
                    { ...state.usages[1], kasittely_maara: 100 - value },
                ],
            })),
        updateSecondUsage: (id: number | undefined) =>
            set((state) => ({
                usages: [
                    { ...state.usages[0] },
                    { ...state.usages[1], kasittelyid: id },
                ],
            })),
        updateSecondUsageAmount: (value: number) =>
            set((state) => ({
                usages: [
                    { ...state.usages[0], kasittely_maara: 100 - value },
                    { ...state.usages[1], kasittely_maara: value },
                ],
            })),
        resetSecondUsage: () =>
            set((state) => ({
                usages: [
                    { ...state.usages[0], kasittely_maara: 100 },
                    { kasittelyid: undefined, kasittely_maara: 0 },
                ],
            })),
        clearForm: () =>
            set({
                shot: {
                    jasen_id: undefined,
                    kaatopaiva: undefined,
                    ruhopaino: 0,
                    paikka_teksti: "",
                    elaimen_nimi: undefined,
                    sukupuoli: undefined,
                    ikaluokka: undefined,
                    lisatieto: "",
                },
                usages: [
                    {
                        kasittelyid: undefined,
                        kasittely_maara: 100,
                    },
                    {
                        kasittelyid: undefined,
                        kasittely_maara: 0,
                    },
                ],
            }),
    })
);

type MembershipFormActions = {
    updateMemberId: (id: number | undefined) => void;
    updatePartyId: (id: number | undefined) => void;
    updateGroupId: (id: number | undefined) => void;
    updateJoinDate: (text: string | undefined) => void;
    updateShare: (share: number | undefined) => void;
    clearForm: () => void;
};

export const useMemberShipFormStore = create<
    Partial<MembershipFormType> & MembershipFormActions
>((set) => ({
    jasen_id: undefined,
    seurue_id: undefined,
    ryhma_id: undefined,
    osuus: undefined,
    liittyi: undefined,
    updateMemberId: (id: number | undefined) => set(() => ({ jasen_id: id })),
    updatePartyId: (id: number | undefined) => set(() => ({ seurue_id: id })),
    updateGroupId: (id: number | undefined) => set(() => ({ ryhma_id: id })),
    updateJoinDate: (text: string | undefined) =>
        set(() => ({ liittyi: text })),
    updateShare: (value: number | undefined) => set(() => ({ osuus: value })),
    clearForm: () =>
        set({
            jasen_id: undefined,
            seurue_id: undefined,
            ryhma_id: undefined,
            osuus: 100,
            liittyi: undefined,
        }),
}));

type ShareFormActions = {
    updateShotUsage: (id: number) => void;
    updatePortion: (portion: string | undefined) => void;
    updateShareDate: (date: string | undefined) => void;
    updateInitWeight: (weight: number) => void;
    // updateReceiverId: (id: number | undefined) => void;
    clearForm: () => void;
};

type GroupShareFormActions = ShareFormActions & {
    updateGroupId: (id: number | undefined) => void;
};

type MemberShareFormActions = ShareFormActions & {
    updateMemberId: (id: number | undefined) => void;
};

export const useGroupShareFormStore = create<
    GroupShareFormType & GroupShareFormActions
>((set) => ({
    ryhma_id: undefined,
    osnimitys: undefined,
    paiva: undefined,
    kaadon_kasittely_id: undefined,
    maara: undefined,
    updateGroupId: (id: number | undefined) =>
        set({
            ryhma_id: id,
        }),
    updatePortion: (portion: string | undefined) =>
        set({
            osnimitys: portion,
        }),
    updateInitWeight: (weight: number) => set({ maara: weight }),
    updateShareDate: (date: string | undefined) => set({ paiva: date }),
    updateShotUsage: (id: number) => set({ kaadon_kasittely_id: id }),
    clearForm: () =>
        set({
            ryhma_id: undefined,
            osnimitys: "",
            maara: undefined,
            kaadon_kasittely_id: undefined,
            paiva: "",
        }),
}));

export const useMemberShareFromStore = create<
    MemberShareFormActions & MemberShareFormType
>((set) => ({
    jasenyys_id: undefined,
    osnimitys: undefined,
    paiva: undefined,
    kaadon_kasittely_id: undefined,
    maara: undefined,
    updateMemberId: (id: number | undefined) =>
        set({
            jasenyys_id: id,
        }),
    updatePortion: (portion: string | undefined) =>
        set({
            osnimitys: portion,
        }),
    updateInitWeight: (weight: number) => set({ maara: weight }),
    updateShareDate: (date: string | undefined) => set({ paiva: date }),
    updateShotUsage: (id: number) => set({ kaadon_kasittely_id: id }),
    clearForm: () =>
        set({
            jasenyys_id: undefined,
            osnimitys: "",
            maara: undefined,
            kaadon_kasittely_id: undefined,
            paiva: "",
        }),
}));
