const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
};

const promptInput = async (text: string) => {
  printLine(`\n${text}\n>`, false)
  const input: string = await new Promise((resolve) => process.stdin.once('data', (data) => resolve(data.toString())))
  return input.trim()
}

class HitAndBlow {
  private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  private answer: string[] = []
  private tryCount = 0
  private mode: 'normal' | 'hard'

  constructor(mode: 'normal' | 'hard') {
    this.mode = mode
  }

  setting() {
    const answerLength = this.getAnswerLength();

    while(this.answer.length < answerLength) {
      const randNum = Math.floor(Math.random() * this.answerSource.length)
      const selectedItem = this.answerSource[randNum]
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem)
      }
    }
  }

  async play() {
    const answerLength = this.getAnswerLength()
    const inputArr = (await promptInput(`「,」区切りで0~9の${answerLength}つの数字を入力してください`)).split(',')

    if (this.validate(inputArr)) {
      printLine(`${this.validate(inputArr)}`)
      await this.play()
      return
    }

    const result = this.check(inputArr)
    if (result.hit !== this.answer.length) {
      // 不正解だったら続ける
      printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
      this.tryCount += 1
      await this.play()
    } else {
      // 正解だったら終了
      this.tryCount += 1
    }
  }

  private validate(inputArr: string[]): string {
    const isLengthValid: boolean = inputArr.length === this.answer.length
    const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
    const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
    if (!isLengthValid) {
      return '入力する数字の数を確認してください'
    } else if (!isAllAnswerSourceOption) {
      return '0~9の半角数字を入力してください'
    } else if (!isAllDifferentValues) {
      return '入力する数字は全て異なる数字にしてください'
    } else {
      return ''
    }
  }

  private check(input: string[]) {
    let hitCount = 0
    let blowCount = 0

    input.forEach((val, index) => {
      if (val === this.answer[index]) {
        hitCount += 1
      } else if (this.answer.includes(val)) {
        blowCount += 1
      }
    })

    return {
      hit: hitCount,
      blow: blowCount,
    }
  }

  private getAnswerLength() {
    switch (this.mode) {
      case 'normal':
        return 3
      case 'hard':
        return 4
    }
  }

  end() {
    printLine(`正解です！\n試行回数: ${this.tryCount}回`)
    process.exit()
  }
}

;(async () => {
  const hitAndBlow = new HitAndBlow('normal')
  hitAndBlow.setting()
  await hitAndBlow.play()
  hitAndBlow.end()
})()
