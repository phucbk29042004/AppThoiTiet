// navigation/types.ts
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Detail: { city: string };
};

export function removeVietnameseTones(str: string) {
  if (!str) return "";
  return str
    .normalize("NFD")                // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu tổ hợp
    .replace(/đ/g, "d")              // đ → d
    .replace(/Đ/g, "D")              // Đ → D
    .toLowerCase()
    .trim();
}