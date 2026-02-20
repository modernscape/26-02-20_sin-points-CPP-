#include <emscripten/bind.h>
#include <cmath>
#include <vector>

class SineWaveSim {
private:
    int numPoints;
    std::vector<float> positions; // [x0, y0, z0, x1, y1, z1, ...]
    float time = 0.0f;

public:
    SineWaveSim(int n) : numPoints(n) {
        positions.resize(n * 3);
        for (int i = 0; i < n; i++) {
            positions[i * 3 + 0] = (float)i * 0.1f; // x: 一定間隔
            positions[i * 3 + 1] = 0.0f;           // y: 初期値
            positions[i * 3 + 2] = 0.0f;           // z: 固定
        }
    }

    void update(float dt) {
        time += dt;
        for (int i = 0; i < numPoints; i++) {
            // y = sin(x + time)
            float x = positions[i * 3 + 0];
            positions[i * 3 + 1] = std::sin(x + time);
        }
    }

    // JS側からメモリを覗くためのポインタ取得
    uintptr_t getPositionPointer() const {
        return reinterpret_cast<uintptr_t>(positions.data());
    }
};

using namespace emscripten;
EMSCRIPTEN_BINDINGS(my_module) {
    class_<SineWaveSim>("SineWaveSim")
        .constructor<int>()
        .function("update", &SineWaveSim::update)
        .function("getPositionPointer", &SineWaveSim::getPositionPointer);
}