import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";
import { UserNotAuthenticatedError } from "./api/errors";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash("wrongPassword", hash1);
    expect(result).toBe(false);
  });

  it("should return false when password doesn't match a different hash", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  it("should return false for an empty password", async () => {
    const result = await checkPasswordHash("", hash1);
    expect(result).toBe(false);
  });

  it("should return false for an invalid hash", async () => {
    const result = await checkPasswordHash(password1, "invalidhash");
    expect(result).toBe(false);
  });
});

describe("JWT Functions", () => {
  const secret = "testSecret";
  const wrongSecret = "wrongSecret";
  const userID = "someUniqueUserID";
  let validToken: string;

  beforeAll(async () => {
    validToken = await makeJWT(userID, "3600", secret);
  });

  it("should return the userID from a valid token", async () => {
    const result = await validateJWT(validToken, secret);
    expect(result).toBe(userID);
  });

  it("should throw an error for an invalid token sttring", async () => {
    expect(() => validateJWT("inavlid.token.string", secret)).toThrow(
      UserNotAuthenticatedError
    );
  });

  it("should throw an error when the token is signed with the wrong secret", async () => {
    expect(() => validateJWT(validToken, wrongSecret)).toThrow(
      UserNotAuthenticatedError
    );
  });
});
