class UserController {
  async hello(req, res) {
    return res.json({ id: 1, name: 'rodrigo', email: 'hello@hello.com' });
  }
}

export default new UserController();
