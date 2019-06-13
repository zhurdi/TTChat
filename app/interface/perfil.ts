
export interface Perfil {
  uid: string
  email: string,
  phoneNumber?: string,
  password: string,
  displayName: string,
  photoURL: string,
  disabled?: boolean
}