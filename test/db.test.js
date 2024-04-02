test("test", (done) => {
    expect(1).toBe(1)
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
});