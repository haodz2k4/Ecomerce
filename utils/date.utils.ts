export const isValidBirthDate = (birthDate: string): boolean => {
    const birthDateObj = new Date(birthDate);
    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
    const oneHundredTwentyYearsAgo = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

    return birthDateObj < threeYearsAgo && birthDateObj >= oneHundredTwentyYearsAgo;
};
