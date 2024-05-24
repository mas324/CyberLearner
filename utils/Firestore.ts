import * as Firebase from "firebase/app";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    initializeAuth,
    AuthErrorCodes,
    signOut as fireOut,
} from "firebase/auth";
import { Question, User } from "./Types";
import { getItem } from "./LocalStore";

export const FireStatusCodes = {
    SUCCESS: 10,
    EMAIL_INVALID: 21,
    NO_USER: 20,
    NO_DATA: 1,
    LOGIN_INVALID: 32,
    ERROR_BAD: 99,
};

const firebaseApp = Firebase.initializeApp(
    JSON.parse(process.env.EXPO_PUBLIC_FIRESTORE_API as string)
);

const auth = initializeAuth(firebaseApp);
const db = getFirestore(firebaseApp);
auth.onAuthStateChanged((change) => {
    const nullCheck = change === null;
    console.log("Firestore: auth change:", nullCheck ? change : "user is set");
    nullCheck ? null : change.getIdToken(true);
    //console.log('Firestore: auth change:', change);
});

export async function signIn(username: string, password: string) {
    try {
        const user = (
            await signInWithEmailAndPassword(auth, username, password)
        ).user;
        const userDoc = doc(db, "users", user.uid);
        return {
            status: FireStatusCodes.SUCCESS,
            data: await getDoc(userDoc),
            user: user,
        };
    } catch (error: any) {
        console.error(error);
        if (error.code === AuthErrorCodes.USER_DELETED) {
            return { status: FireStatusCodes.NO_USER };
        } else if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
            return { status: FireStatusCodes.LOGIN_INVALID };
        } else {
            return { status: FireStatusCodes.ERROR_BAD };
        }
    }
}

export async function signOut() {
    fireOut(auth);
}

export async function reauthenticate() {
    const user = auth.currentUser;
    if (user == undefined || user == null) {
        const newUser = await getItem("@fireUser");
        if (newUser == undefined || newUser == null) {
            console.log("Firestore: no past user tokens. logging out of app");
            return false;
        }
        console.log("Firestore: loading user as", newUser.email);
        auth.updateCurrentUser(newUser).catch((_err) => {
            //console.log('Firestore: ignore', _err);
        });
        return true;
    } else {
        user.getIdToken(true)
            .catch((_err) => {})
            .finally(() => console.log("Firestore: token refresh"));
        return true;
    }
}

export async function signUp(newUser: User, password: string) {
    try {
        const user = (
            await createUserWithEmailAndPassword(auth, newUser.email, password)
        ).user;
        await setDoc(doc(db, "users", user.uid), newUser);
        console.log("User ID:", user.uid);
        console.log("Document written");
        return { status: FireStatusCodes.SUCCESS, data: user };
    } catch (error: any) {
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
            return { status: FireStatusCodes.EMAIL_INVALID, data: null };
        } else {
            console.log("Firestore: returning unknown error:", error.code);
            return { status: FireStatusCodes.ERROR_BAD, data: null };
        }
    }
}

export async function addQAS(newQuestion: Question) {
    try {
        await addDoc(collection(db, "qas"), newQuestion);
    } catch (_err) {
        console.error(_err);
    }
}

export async function getQuestions() {
    try {
        const docs = await getDocs(collection(db, "qas"));
        if (docs.empty) {
            return null;
        }
        const questionArray = Array<Question>();
        docs.forEach((result) => {
            questionArray.push(result.data() as Question);
        });
        return questionArray;
    } catch (_err) {
        console.error(_err);
        return null;
    }
}

type Translation = {
    cve_id: string;
    description: string;
};

export async function addDesc(newDesc: Translation) {
    try {
        const colRef = collection(db, "cve");
        await addDoc(colRef, newDesc);
    } catch (_err) {
        console.error(_err);
    }
}

export async function getDescription(cve_id: string) {
    try {
        const docs = await getDocs(
            query(collection(db, "cve"), where("cve_id", "==", cve_id))
        );
        if (docs.empty) {
            return null;
        }
        const returnArray = Array<Translation>();
        docs.forEach((result) => {
            returnArray.push(result.data() as any);
        });
        return returnArray;
    } catch (_err) {
        console.error(_err);
        return null;
    }
}

export async function getAllDescriptions() {
    try {
        const docs = await getDocs(collection(db, "cve"));
        if (docs.empty) {
            return null;
        }
        const all = Array<Translation>();
        docs.forEach((result) => {
            all.push(result.data() as Translation);
        });
        return all;
    } catch (_err) {
        console.error(_err);
        return null;
    }
}
